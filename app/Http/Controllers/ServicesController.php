<?php

namespace App\Http\Controllers;

use App\Domain\Services\DTOs\ServiceData;
use App\Domain\Services\Services\ServiceService;
use App\Http\Requests\ServiceStoreRequest;
use App\Http\Requests\ServiceUpdateRequest;
use App\Models\Service;
use App\Models\ServiceCategory;
use Inertia\Inertia;

class ServicesController extends Controller
{
    private ServiceService $service;

    public function __construct(ServiceService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $search = request()->query('search');

        $services = $this->service->listServices($search, 10);

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
        $categories = ServiceCategory::select('id', 'name')->latest('name')->get();

        return Inertia::render('Services/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ServiceStoreRequest $request)
    {

            $data = ServiceData::fromValidated($request->validated());

            $this->service->create($data);

            return redirect()
                ->route('services.index')
                ->with('success', __('Service created successfully.'));

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Service $service)
    {
        // get all services categories to show in select input
        $categories = ServiceCategory::select('id', 'name')->latest('name')->get();

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

            $data = ServiceData::fromValidated($request->validated());

            $this->service->update($service, $data);

            return redirect()
                ->route('services.index')
                ->with('success', __('Service updated successfully.'));

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service)
    {

            $this->service->delete($service);

            return redirect()
                ->route('services.index')
                ->with('success', __('Service deleted successfully.'));

    }
}
