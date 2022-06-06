use anchor_lang::prelude::*;

declare_id!("5s4ZVnacCK35W8pkuMrLwyXcAU8hrV2GLW1DuKuXKYHV");

#[program]
pub mod deep_clean {

    use anchor_lang::solana_program::{entrypoint_deprecated::ProgramResult};

    use super::*;

    pub fn initialize(ctx: Context<SetupPlatform>, edit: bool, share: bool) -> ProgramResult {
        let data = &mut ctx.accounts.data;
        data.editable = edit;
        data.sharable = share;
        data.media_hash = "".to_string();
        Ok(())
    }

    pub fn uploadmedia(ctx: Context<UploadMedia>, user_public_key: Pubkey, media_hash: String) -> ProgramResult {
        let data = &mut ctx.accounts.data;
        if data.media_hash == "".to_string() {
            data.creator = user_public_key;
            data.media_hash = media_hash;
        // } else {
        //     return Err(Errors::MediaAlreadyExists.into());
        }
        Ok(())
    }

    pub fn sharemedia(ctx: Context<ShareMedia>, user_sharing_media: Pubkey) -> ProgramResult {
        let data = &mut ctx.accounts.data;
        if data.sharable == true {
            data.people_who_shared.push(user_sharing_media)
        // } else {
        //     return Err(Errors::MediaDoesntExists.into());
        }
        Ok(())
    }


}

#[derive(Accounts)]
pub struct SetupPlatform<'info> {
    #[account(init, payer = user, space =9000)]
    pub data: Account<'info, Metadata>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UploadMedia<'info> {
    #[account(mut)]
    pub data: Account<'info, Metadata>
}

#[derive(Accounts)]
pub struct ShareMedia<'info> {
    #[account(mut)]
    pub data: Account<'info, Metadata>
}

#[account] //An attribute for a data structure representing a Solana account.
#[derive(Default)]
pub struct Metadata {
    creator: Pubkey,
    media_hash: String,
    editable: bool,
    sharable: bool,
    people_who_shared: Vec<Pubkey>,
}

// #[error]
// pub enum Errors {
//     #[msg("Media already exists")]
//     MediaAlreadyExists,

//     #[msg("Media doesnt exists")]
//     MediaDoesntExists,
// }