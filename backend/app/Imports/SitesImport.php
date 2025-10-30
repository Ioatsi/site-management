<?php

namespace App\Imports;

use App\Models\Site;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class SitesImport implements ToModel, WithHeadingRow
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        // Convert installation date string to Y-m-d format
        $installationDate = !empty($row['installation_date'])
            ? date('Y-m-d', strtotime($row['installation_date']))
            : null;
        return Site::updateOrCreate(
            ['sitenumber' => $row['sitenumber']],
            [
                'sitename' => $row['sitename'] ?? null,
                'lat' => $row['lat'] ?? null,
                'lon' => $row['lon'] ?? null,
                'area' => $row['area'] ?? null,
                'installation_date' => $installationDate,
            ]
        );
    }
}
