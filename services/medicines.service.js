angular.module('pharmacyApp')
.service('MedicinesService', ['SupabaseService', function(SupabaseService) {
    const self = this;
    const db = SupabaseService.client;

    //Get ALL
    self.getAll = async function() {
        const { data, error } = await db
            .from('medicines')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        return data;
    };

    //Get  by categ
    self.getByCategory = async function(category) {
        const { data, error } = await db
            .from('medicines')
            .select('*')
            .eq('category', category)
            .order('name', { ascending: true });

        if (error) throw error;
        return data;
    };

    // search by name
    self.search = async function(query) {
        const { data, error } = await db
            .from('medicines')
            .select('*')
            .ilike('name', `%${query}%`)
            .order('name', { ascending: true });

        if (error) throw error;
        return data;
    };

    // get all categ 
    self.getCategories = async function() {
        const { data, error } = await db
            .from('medicines')
            .select('category');

        if (error) throw error;

        // remove dupl
        const unique = [...new Set(data.map(m => m.category))];
        return unique.sort();
    };

    // get med by id
    self.getById = async function(id) {
        const { data, error } = await db
            .from('medicines')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    };

    // update after purchase
    self.updateStock = async function(id, newStock) {
        const { error } = await db
            .from('medicines')
            .update({ stock: newStock })
            .eq('id', id);

        if (error) throw error;
    };
    // Add new medicine
    self.add = async function(medicine) {
        const { data, error } = await db
            .from('medicines')
            .insert(medicine)
            .select()
            .single();
        if (error) throw error;
        return data;
    };

    // Update medicine
    self.update = async function(id, medicine) {
        const { data, error } = await db
            .from('medicines')
            .update(medicine)
            .eq('id', id)
            .select()
            .single();
        if (error) throw error;
        return data;
    };

    // Delete medicine
    self.delete = async function(id) {
        const { error } = await db
            .from('medicines')
            .delete()
            .eq('id', id);
        if (error) throw error;
    };

}]);
