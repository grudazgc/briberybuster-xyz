use anchor_lang::prelude::*;

/// Treasury account that holds program authority and stats
#[account]
#[derive(InitSpace)]
pub struct Treasury {
    /// Authority that can manage the treasury
    pub authority: Pubkey,
    /// Bump seed for PDA derivation
    pub bump: u8,
    /// Total number of reports submitted
    pub total_reports: u64,
    /// Total amount of rewards distributed
    pub total_rewards_distributed: u64,
}

/// Report account storing corruption report metadata
#[account]
#[derive(InitSpace)]
pub struct Report {
    /// Public key of the reporter
    pub reporter: Pubkey,
    /// SHA-256 hash of the report data
    pub hash: [u8; 32],
    /// Unix timestamp when report was submitted
    pub timestamp: i64,
    /// Whether the report has been verified by admin
    pub verified: bool,
}

impl Treasury {
    pub const INIT_SPACE: usize = 32 + 1 + 8 + 8;
}

impl Report {
    pub const INIT_SPACE: usize = 32 + 32 + 8 + 1;
}
