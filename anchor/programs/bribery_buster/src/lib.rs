use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

pub mod state;
pub mod errors;

use state::*;
use errors::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod bribery_buster {
    use super::*;

    /// Initialize the treasury PDA account
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let treasury = &mut ctx.accounts.treasury;
        treasury.authority = ctx.accounts.authority.key();
        treasury.bump = ctx.bumps.treasury;
        treasury.total_reports = 0;
        treasury.total_rewards_distributed = 0;
        
        msg!("Treasury initialized with authority: {}", treasury.authority);
        Ok(())
    }

    /// Submit a corruption report hash to the blockchain
    pub fn submit_report(
        ctx: Context<SubmitReport>,
        report_hash: [u8; 32],
    ) -> Result<()> {
        let report = &mut ctx.accounts.report;
        let treasury = &mut ctx.accounts.treasury;
        
        report.reporter = ctx.accounts.reporter.key();
        report.hash = report_hash;
        report.timestamp = Clock::get()?.unix_timestamp;
        report.verified = false;
        
        treasury.total_reports = treasury.total_reports.checked_add(1)
            .ok_or(BriberyBusterError::MathOverflow)?;
        
        msg!("Report submitted by: {}", report.reporter);
        msg!("Report hash: {:?}", report_hash);
        Ok(())
    }

    /// Reward user with CORRUPT tokens from treasury PDA
    pub fn reward_user(
        ctx: Context<RewardUser>,
        amount: u64,
    ) -> Result<()> {
        require!(amount > 0, BriberyBusterError::InvalidAmount);
        
        let treasury = &mut ctx.accounts.treasury;
        let seeds = &[
            b"treasury",
            treasury.authority.as_ref(),
            &[treasury.bump],
        ];
        let signer = &[&seeds[..]];

        // Transfer tokens from treasury to user
        let cpi_accounts = Transfer {
            from: ctx.accounts.treasury_token_account.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: treasury.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, amount)?;
        
        treasury.total_rewards_distributed = treasury.total_rewards_distributed
            .checked_add(amount)
            .ok_or(BriberyBusterError::MathOverflow)?;
        
        msg!("Rewarded {} tokens to user: {}", amount, ctx.accounts.user.key());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Treasury::INIT_SPACE,
        seeds = [b"treasury", authority.key().as_ref()],
        bump
    )]
    pub treasury: Account<'info, Treasury>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubmitReport<'info> {
    #[account(
        init,
        payer = reporter,
        space = 8 + Report::INIT_SPACE
    )]
    pub report: Account<'info, Report>,
    
    #[account(mut)]
    pub treasury: Account<'info, Treasury>,
    
    #[account(mut)]
    pub reporter: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RewardUser<'info> {
    #[account(
        mut,
        seeds = [b"treasury", treasury.authority.as_ref()],
        bump = treasury.bump
    )]
    pub treasury: Account<'info, Treasury>,
    
    #[account(mut)]
    pub treasury_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    
    /// CHECK: User receiving the reward
    pub user: AccountInfo<'info>,
    
    pub token_program: Program<'info, Token>,
}
