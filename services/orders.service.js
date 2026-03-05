angular.module('pharmacyApp')
.service('OrdersService', ['SupabaseService', function(SupabaseService) {
    const client = SupabaseService.client;

    // ── Create full order ──────────────────────
    this.createOrder = async function(cart, customer, notes) {
        try {
            // Step 1: Calculate total
            const total = cart.reduce((sum, item) => 
                sum + (item.price * item.qty), 0);

            // Step 2: Create invoice
            const { data: invoice, error: invoiceError } = await client
                .from('invoices')
                .insert({
                    customer_id: customer.id,
                    total:       total,
                    status:      'pending',
                    notes:       notes || ''
                })
                .select()
                .single();

            if (invoiceError) throw invoiceError;

            // Step 3: Create invoice items
            const items = cart.map(item => ({
                invoice_id:  invoice.id,
                medicine_id: item.id,
                quantity:    item.qty,
                unit_price:  item.price
            }));

            const { error: itemsError } = await client
                .from('invoice_items')
                .insert(items);

            if (itemsError) throw itemsError;

            // Step 4: Update stock for each medicine
            for (const item of cart) {
                const newStock = item.stock - item.qty;
                await client
                    .from('medicines')
                    .update({ stock: newStock })
                    .eq('id', item.id);
            }

            return { success: true, invoice: invoice };

        } catch (err) {
            console.error('createOrder error:', err);
            return { success: false, error: err.message };
        }
    };

    // ── Get customer orders ────────────────────
    this.getCustomerOrders = async function(customerId) {
        const { data, error } = await client
            .from('invoices')
            .select(`
                *,
                invoice_items (
                    *,
                    medicines ( name, category )
                )
            `)
            .eq('customer_id', customerId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    };

}]);