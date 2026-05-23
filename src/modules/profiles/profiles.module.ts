import { Module } from '@nestjs/common';
import { BuildChangesHistoryService } from '../../common/services/changes-history/build-changes-history.service';
import { ProfilesRepository } from './repositories/profiles.repository';
import { CreateProfileService } from './services/create-profile/create-profile.service';
import { FindProfileByDocumentService } from './services/find-profile-by-document/find-profile-by-document.service';
import { FindProfileByEmailService } from './services/find-profile-by-email/find-profile-by-email.service';
import { FindProfileByUniqueIdService } from './services/find-profile-by-unique-id/find-profile-by-unique-id.service';
import { GetAllProfilesService } from './services/get-all-profiles/get-all-profiles.service';
import { UpdateProfileService } from './services/update-profile/update-profile.service';
import { PROFILES_REPOSITORY } from './tokens/profiles.tokens';

@Module({
  providers: [
    {
      provide: PROFILES_REPOSITORY,
      useClass: ProfilesRepository,
    },
    BuildChangesHistoryService,
    CreateProfileService,
    UpdateProfileService,
    FindProfileByUniqueIdService,
    FindProfileByEmailService,
    FindProfileByDocumentService,
    GetAllProfilesService,
  ],
  exports: [
    PROFILES_REPOSITORY,
    CreateProfileService,
    UpdateProfileService,
    FindProfileByUniqueIdService,
    FindProfileByEmailService,
    FindProfileByDocumentService,
    GetAllProfilesService,
  ],
})
export class ProfilesModule {}