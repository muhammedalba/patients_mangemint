<?php

namespace App\Http\Controllers;

use App\Domain\ServiceCategories\DTOs\ServiceCategoryData;
use App\Domain\ServiceCategories\Services\ServiceCategoryService;
use App\Http\Requests\ServiceCategoryStoreRequest;
use App\Http\Requests\ServiceCategoryUpdateRequest;
use App\Models\ServiceCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceCategoriesController extends Controller
{
    private ServiceCategoryService $service;

    public function __construct(ServiceCategoryService $service)
    {
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $serviceCategories = $this->service->listCategories($search, 10);

        return Inertia::render('ServiceCategories/Index', [
            'serviceCategories' => $serviceCategories,
            'filters' => $request->only('search'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param ServiceCategoryStoreRequest $request
     * @return RedirectResponse
     */
    public function store(ServiceCategoryStoreRequest $request): RedirectResponse
    {
        $data = ServiceCategoryData::fromValidated($request->validated());

        $this->service->create($data);

        return redirect()->route('service-categories.index')->with('success', 'Service category created successfully.');
    }

    /**
     * Display the specified resource.
     *
     * @param ServiceCategory $serviceCategory
     * @return Response
     */
    public function show(ServiceCategory $serviceCategory): Response
    {
        return Inertia::render('ServiceCategories/Show', [
            'serviceCategory' => $serviceCategory,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create(): Response
    {
        return Inertia::render('ServiceCategories/Create');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param ServiceCategory $serviceCategory
     * @return Response
     */
    public function edit(ServiceCategory $serviceCategory): Response
    {
        return Inertia::render('ServiceCategories/Edit', [
            'category' => $serviceCategory,
        ]);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param ServiceCategoryUpdateRequest $request
     * @param ServiceCategory $serviceCategory
     * @return RedirectResponse
     */
    public function update(ServiceCategoryUpdateRequest $request, ServiceCategory $serviceCategory): RedirectResponse
    {
        $data = ServiceCategoryData::fromValidated($request->validated());

        $this->service->update($serviceCategory, $data);

        return redirect()->route('service-categories.index')->with('success', 'Service category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param ServiceCategory $serviceCategory
     * @return RedirectResponse
     */
    public function destroy(ServiceCategory $serviceCategory): RedirectResponse
    {
        $this->service->delete($serviceCategory);

        return redirect()->route('service-categories.index')->with('success', 'Service category deleted successfully.');
    }
}
