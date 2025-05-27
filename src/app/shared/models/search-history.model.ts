import { UserInfoModel } from "./user-info.model";

export type UserSearchHistoryModel = {
    searchTerm: string;
    countOfFoundUsers: number;
    firstUserItem: UserInfoModel | null;
}