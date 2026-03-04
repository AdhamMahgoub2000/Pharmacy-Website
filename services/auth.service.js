angular.module('pharmacyApp')
.service('AuthService', ['SupabaseService', function(SupabaseService) {

    const client = SupabaseService.client;

    this.login = async function(email, password) {
        return await client.auth.signInWithPassword({
            email: email,
            password: password
        });
    };
    this.getUser = async function () {
        const { data } = await client.auth.getUser();
        return data.user;
        };

    this.getUserData = async function (userId) {
      const { data } = await client
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();
      return data;
    };

    this.logout = async function () {
      await client.auth.signOut();
    };
    this.verifySession = async function () {
      const { data, error } = await client.auth.getSession();
      return { session: data?.session, error };
    };
}]);