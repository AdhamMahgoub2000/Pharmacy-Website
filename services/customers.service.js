angular.module('pharmacyApp')
.service('CustomersService', ['SupabaseService', function(SupabaseService) {
    const client = SupabaseService.client;
    this.getAllCustomers = async function() {
        const { data, error } = await client
            .from('users')
            .select('*')
            .eq('role', 'customer')
            .order('created_at', { ascending: false });
        console.log(data)
        if (error) throw error;
        return data;
    };
    this.updateCustomer = async function(customer) {
    const { data, error } = await client
        .from('users')
        .update({
            name: customer.full_name,
            email: customer.email,
            role:customer.role
        })
        .eq('id', customer.id);

    if (error) throw error;
    return data;
};

this.deleteCustomer = async function(customerId) {
    const { data, error } = await client
        .from('users')
        .delete()
        .eq('id', customerId);

    if (error) throw error;
    return data;
};
}]);