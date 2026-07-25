<?php

namespace App\Services;

use InvalidArgumentException;

class SeatGeneratorService
{
    private const AIRCRAFT_LAYOUTS = [
        'ATR' => [
            'row_start' => 1,
            'row_end' => 18,
            'columns' => ['A', 'C', 'D', 'F'],
        ],
        'Airbus 320' => [
            'row_start' => 1,
            'row_end' => 32,
            'columns' => ['A', 'B', 'C', 'D', 'E', 'F'],
        ],
        'Boeing 737 Max' => [
            'row_start' => 1,
            'row_end' => 32,
            'columns' => ['A', 'B', 'C', 'D', 'E', 'F'],
        ],
    ];

    /**
     *
     * @param string $aircraftType
     * @return array<int, string>
     */
    public function generate(string $aircraftType): array
    {
        $layout = $this->getLayout($aircraftType);

        $allSeats = $this->buildAllSeats($layout);

        shuffle($allSeats);

        return array_slice($allSeats, 0, 3);
    }

    private function getLayout(string $aircraftType): array
    {
        if (!array_key_exists($aircraftType, self::AIRCRAFT_LAYOUTS)) {
            throw new InvalidArgumentException("Unknown aircraft type: {$aircraftType}");
        }

        return self::AIRCRAFT_LAYOUTS[$aircraftType];
    }

    /**
     *
     * @return array<int, string>
     */
    private function buildAllSeats(array $layout): array
    {
        $seats = [];

        for ($row = $layout['row_start']; $row <= $layout['row_end']; $row++) {
            foreach ($layout['columns'] as $column) {
                $seats[] = $row . $column;
            }
        }

        return $seats;
    }
}