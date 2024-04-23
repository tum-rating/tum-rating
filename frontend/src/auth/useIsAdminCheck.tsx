import {useUser as useUserAdmin} from "@/admin/useUser.ts";
import {useUser as useUserClient} from "@/auth/useUser.tsx";

const useIsAdminCheck = () => {
    const clientUser = useUserClient();
    const adminUser = useUserAdmin(String(clientUser.data?.id));
    return adminUser.data?.role;
}

export {useIsAdminCheck}