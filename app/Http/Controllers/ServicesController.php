<?php

namespace App\Http\Controllers;

use App\Http\Requests\ServiceStoreRequest;
use App\Http\Requests\ServiceUpdateRequest;
use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ServicesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $search = request()->query('search');

        $services = Service::with('category')
            ->when(
                $search,
                fn($query) =>
                $query->where('name', 'like', "%{$search}%")
            )
            ->latest()
            ->paginate(10)
            ->withQueryString();

        // تعديل البيانات لتضمين اسم الفئة فقط
        $services->getCollection()->transform(function ($service) {
            return [
                'id' => $service->id,
                'name' => $service->name,
                'description' => $service->description,
                'price' => $service->price,
                'category' => $service->category?->name,
            ];
        });

        return Inertia::render('Services/Index', [
            'services' => $services,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {


        // get all services categories to show in select input
        $categories = ServiceCategory::select('id', 'name')->get();
        return Inertia::render('Services/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ServiceStoreRequest $request)
    {
        try {
            $validated = $request->validated();
            Service::create($validated);

            return redirect()
                ->route('services.index')
                ->with('success', __('Service created successfully.'));
        } catch (\Throwable $e) {
            Log::error('Failed to create service', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $request->all(),
            ]);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', __('Something went wrong while creating the service.'));
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Service $service)
    {
        // get all services categories to show in select input
        $categories = ServiceCategory::select('id', 'name')->get();
        return Inertia::render('Services/Edit', [
            'service' => $service,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ServiceUpdateRequest $request, Service $service)
    {
        try {
            $validated = $request->validated();
            $service->update($validated);

            return redirect()
                ->route('services.index')
                ->with('success', __('Service updated successfully.'));
        } catch (\Throwable $e) {
            Log::error('Failed to update service', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'service_id' => $service->id,
                'data' => $request->all(),
            ]);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', __('Something went wrong while updating the service.'));
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service)
    {
        try {
            $service->delete();

            return redirect()
                ->route('services.index')
                ->with('success', __('Service deleted successfully.'));
        } catch (\Throwable $e) {
            Log::error('Failed to delete service', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'service_id' => $service->id,
            ]);

            return redirect()
                ->route('services.index')
                ->with('error', __('Something went wrong while deleting the service.'));
        }
    }
}
