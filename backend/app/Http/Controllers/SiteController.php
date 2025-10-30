<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Site;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\SitesImport;

class SiteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Site::query();

        // --- Filtering ---
        if ($request->has('lat_min')) {
            $query->where('lat', '>=', $request->lat_min);
        }
        if ($request->has('lat_max')) {
            $query->where('lat', '<=', $request->lat_max);
        }
        if ($request->has('lon_min')) {
            $query->where('lon', '>=', $request->lon_min);
        }
        if ($request->has('lon_max')) {
            $query->where('lon', '<=', $request->lon_max);
        }

        // --- Sorting ---
        $sortable = ['sitename', 'sitenumber', 'lat', 'lon', 'area', 'installation_date'];
        $sortBy = in_array($request->get('sort_by'), $sortable) ? $request->get('sort_by') : 'sitenumber';
        $sortOrder = $request->get('sort_order') === 'desc' ? 'desc' : 'asc';


        if (!in_array($sortBy, $sortable)) {
            $sortBy = 'sitenumber';
        }
    
        $query->orderBy($sortBy, $sortOrder);
    
        // --- Pagination ---
        $perPage = $request->get('per_page', 10);
        $sites = $query->paginate($perPage);
    
        return response()->json($sites);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'sitename' => 'required|string|max:255',
            'sitenumber' => 'required|string|max:255|unique:sites',
            'lat' => 'nullable|numeric',
            'lon' => 'nullable|numeric',
            'area' => 'nullable|string|max:255',
            'installation_date' => 'nullable|date',
        ]);

        $site = Site::create($validated);
        return response()->json($site, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $sitenumber)
    {
        $site = Site::findOrFail($sitenumber);

        $validated = $request->validate([
            'sitename' => 'required|string|max:255',
            'sitenumber' => 'required|string|max:255|unique:sites,sitenumber,' . $site->getKey() . ',' . $site->getKeyName(),
            'lat' => 'nullable|numeric',
            'lon' => 'nullable|numeric',
            'area' => 'nullable|string|max:255',
            'installation_date' => 'nullable|date',
        ]);

        $site->update($validated);
        return response()->json($site);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Site::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }

    // Import Excel
    public function import(Request $request)
    {
        $request->validate(['file' => 'required|mimes:xlsx,xls']);
        Excel::import(new SitesImport, $request->file('file'));
        return response()->json(['message' => 'Import successful']);
    }
}
