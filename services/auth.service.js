angular.module('pharmacyApp')
.service('AuthService', ['SupabaseService', function(SupabaseService,$rootScope) {

    const client = SupabaseService.client;
    let currentUser = null
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
  this.setUser = function (user) {
    currentUser = user;
    $rootScope.currentUser = user;
  };
this.getUserData = async function (userId) {
  try {
    const { data, error } = await client
      .from("users")
      .select("*")
      .eq("id", userId)
      .single(); 

    if (error) {
      console.error("getUserData error:", error.message);
      return null; 
    }

    if (!data) {
      console.warn("User not found for id:", userId);
      return null;
    }
    return data; 
  } catch (err) {
    console.error("Unexpected error in getUserData:", err);
    return null;
  }
};

    this.logout = async function () {
      await client.auth.signOut();
      AuthService.setUser(null);
    };
    this.verifySession = async function () {
      const { data, error } = await client.auth.getSession();
      return { session: data?.session, error };
    };
    this.register = async function(user) {

    const { data, error } = await client.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          first_name: user.fname,
          address: user.address,
          phone: user.phone,
          dob: user.dob,
        }
      }
    });

    if (error) throw error;

    return data;
  };
}]);