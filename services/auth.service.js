angular.module('pharmacyApp')
.service('AuthService', ['SupabaseService', '$rootScope', function(SupabaseService, $rootScope) {

  const client = SupabaseService.client;
  const self = this;

  // ── Login ──────────────────────────────────────────────────────
  this.login = async function(email, password) {
    return await client.auth.signInWithPassword({ email, password });
  };

  // ── Logout ─────────────────────────────────────────────────────
  this.logout = async function() {
    await client.auth.signOut();
    self.setUser(null); // BUG FIXED: was `AuthService.setUser` — AuthService isn't in scope here
  };

  // ── Register ───────────────────────────────────────────────────
  this.register = async function(user) {
    const { data, error } = await client.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          first_name: user.fname,
          address:    user.address,
          phone:      user.phone,
          dob:        user.dob,
        }
      }
    });
    if (error) throw error;
    return data;
  };

  // ── Get Supabase auth user ─────────────────────────────────────
  this.getUser = async function() {
    const { data } = await client.auth.getUser();
    return data.user;
  };

  // ── Set user on $rootScope so the whole app can read it ────────
  this.setUser = function(user) {
    $rootScope.currentUser = user;
  };

  // ── Fetch user profile row from the 'users' table ─────────────
  this.getUserData = async function(userId) {
    try {
      const { data, error } = await client
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) { console.error('getUserData error:', error.message); return null; }
      if (!data)  { console.warn('User not found for id:', userId);    return null; }
      return data;
    } catch (err) {
      console.error('Unexpected error in getUserData:', err);
      return null;
    }
  };

  // ── Verify active session ──────────────────────────────────────
  this.verifySession = async function() {
    const { data, error } = await client.auth.getSession();
    return { session: data?.session, error };
  };

}]);