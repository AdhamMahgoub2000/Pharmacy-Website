angular.module('pharmacyApp')
.controller('MedicinesController', [
'$scope', 'MedicinesService',
function($scope, MedicinesService) {

    // ── State ──────────────────────────────────
    $scope.medicines         = [];
    $scope.categories        = [];
    $scope.loading           = true;
    $scope.error             = null;
    $scope.searchQuery       = '';
    $scope.selectedCategory  = '';
    $scope.showModal         = false;
    $scope.showDeleteModal   = false;
    $scope.editMode          = false;
    $scope.saving            = false;
    $scope.deleting          = false;
    $scope.modalError        = null;
    $scope.medicineToDelete  = null;

    $scope.form = {
        name: '', description: '', category: '',
        price: '', stock: '', image_url: ''
    };

    // ── Load data ─────────────────────────────
    async function init() {
        try {
            const [medicines, categories] = await Promise.all([
                MedicinesService.getAll(),
                MedicinesService.getCategories()
            ]);
            $scope.$apply(function() {
                $scope.medicines  = medicines;
                $scope.categories = categories;
                $scope.loading    = false;
            });
        } catch (err) {
            $scope.$apply(function() {
                $scope.error   = 'Failed to load medicines.';
                $scope.loading = false;
            });
        }
    }
    init();

    // ── Stats ─────────────────────────────────
    $scope.inStockCount = function() {
        return $scope.medicines.filter(m => m.stock >= 20).length;
    };

    $scope.lowStockCount = function() {
        return $scope.medicines.filter(m => m.stock >= 0 && m.stock < 20).length;
    };

    // ── Filter ────────────────────────────────
    $scope.filteredMedicines = function() {
        return $scope.medicines.filter(function(m) {
            const matchSearch = m.name.toLowerCase()
                .includes($scope.searchQuery.toLowerCase());
            const matchCat = !$scope.selectedCategory ||
                m.category === $scope.selectedCategory;
            return matchSearch && matchCat;
        });
    };

    // ── Add Modal ─────────────────────────────
    $scope.openAddModal = function() {
        $scope.editMode   = false;
        $scope.modalError = null;
        $scope.form = {
            name: '', description: '', category: '',
            price: '', stock: '', image_url: ''
        };
        $scope.showModal = true;
    };

    // ── Edit Modal ────────────────────────────
    $scope.openEditModal = function(med) {
        $scope.editMode   = true;
        $scope.modalError = null;
        $scope.form = {
            id:          med.id,
            name:        med.name,
            description: med.description,
            category:    med.category,
            price:       med.price,
            stock:       med.stock,
            image_url:   med.image_url || ''
        };
        $scope.showModal = true;
    };

    // ── Close Modal ───────────────────────────
    $scope.closeModal = function(event) {
        if (event.target.classList.contains('med-modal-overlay')) {
            $scope.showModal = false;
        }
    };

    // ── Save (Add or Edit) ────────────────────
    $scope.saveMedicine = async function() {
        // Validate
        if (!$scope.form.name || !$scope.form.description ||
            !$scope.form.category || !$scope.form.price ||
            $scope.form.stock === '') {
            $scope.modalError = 'Please fill all required fields.';
            return;
        }

        $scope.saving     = true;
        $scope.modalError = null;

        const payload = {
            name:        $scope.form.name,
            description: $scope.form.description,
            category:    $scope.form.category,
            price:       parseFloat($scope.form.price),
            stock:       parseInt($scope.form.stock),
            image_url:   $scope.form.image_url || null
        };

        try {
            if ($scope.editMode) {
                await MedicinesService.update($scope.form.id, payload);
            } else {
                await MedicinesService.add(payload);
            }

            // Reload medicines
            const medicines = await MedicinesService.getAll();
            $scope.$apply(function() {
                $scope.medicines  = medicines;
                $scope.saving     = false;
                $scope.showModal  = false;
            });

        } catch (err) {
            $scope.$apply(function() {
                $scope.modalError = 'Failed to save. Please try again.';
                $scope.saving     = false;
            });
        }
    };

    // ── Delete ────────────────────────────────
    $scope.deleteMedicine = function(med) {
        $scope.medicineToDelete = med;
        $scope.showDeleteModal  = true;
    };

    $scope.closeDeleteModal = function(event) {
        if (event.target.classList.contains('med-modal-overlay')) {
            $scope.showDeleteModal = false;
        }
    };

    $scope.confirmDelete = async function() {
        $scope.deleting = true;
        try {
            await MedicinesService.delete($scope.medicineToDelete.id);
            const medicines = await MedicinesService.getAll();
            $scope.$apply(function() {
                $scope.medicines       = medicines;
                $scope.deleting        = false;
                $scope.showDeleteModal = false;
                $scope.medicineToDelete = null;
            });
        } catch (err) {
            $scope.$apply(function() {
                $scope.deleting = false;
                $scope.error    = 'Failed to delete medicine.';
            });
        }
    };

}]);