use anchor_lang::prelude::*;

#[error_code]
pub enum BriberyBusterError {
    #[msg("Invalid amount provided")]
    InvalidAmount,
    
    #[msg("Mathematical operation overflow")]
    MathOverflow,
    
    #[msg("Unauthorized access")]
    Unauthorized,
    
    #[msg("Report already verified")]
    AlreadyVerified,
    
    #[msg("Insufficient treasury balance")]
    InsufficientBalance,
    
    #[msg("Invalid report hash")]
    InvalidHash,
}
