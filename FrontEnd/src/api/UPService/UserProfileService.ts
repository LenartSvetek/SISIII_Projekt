import { useDBService } from "@/contexts/DBContext";
import { DBService } from "../DBService/DBService";
import { IProfile } from "./IUserProfileTypes";


export class UserProfileService {
    private DBService : DBService;

    private profile : IProfile;

    public Email : string;
    public Code : string;

    constructor(props) {
        this.DBService = useDBService();
    }

    async IsAuth(){
        return (await this.DBService.AuthUser()).isAuth;
    }

    async Login(username : string, password : string) {
        return (await this.DBService.LoginUser(username, password)).success;
    }

    async Logout(){
        return (await this.DBService.Logout()).success;
    }
}