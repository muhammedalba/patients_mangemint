<?php

namespace App\Http\Controllers;

use App\Http\Requests\ServiceCategoryStoreRequest;
use App\Http\Requests\ServiceCategoryUpdateRequest;
use App\Models\ServiceCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceCategoriesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $query = ServiceCategory::latest();

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->input('search') . '%')
                  ->orWhere('description', 'like', '%' . $request->input('search') . '%');
        }

        $serviceCategories = $query->paginate(10)->withQueryString();

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
        ServiceCategory::create($request->validated());

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
        $serviceCategory->update($request->validated());

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
        $serviceCategory->delete();

        return redirect()->route('service-categories.index')->with('success', 'Service category deleted successfully.');
    }
}
