import { useDBService } from "@/contexts/DBContext";
import { DBService } from "../DBService/DBService";
import { IProfile } from "./IUserProfileTypes";


export class UserProfileService {
    private DBService : DBService;

    private profile : IProfile;

    constructor(props) {
        this.DBService = useDBService();
    }

    async IsAuth(){
        return (await this.DBService.AuthUser()).isAuth;
    }
}