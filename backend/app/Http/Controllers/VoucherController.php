<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckVoucherRequest;
use App\Http\Requests\GenerateVoucherRequest;
use App\Http\Resources\VoucherResource;
use App\Models\Voucher;
use App\Services\SeatGeneratorService;
use Illuminate\Http\JsonResponse;

class VoucherController extends Controller
{
    public function __construct(
        private SeatGeneratorService $seatGenerator
    ) {}

    public function check(CheckVoucherRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $exists = Voucher::where('flight_number', $validated['flightNumber'])
            ->where('flight_date', $validated['date'])
            ->exists();

        return response()->json([
            'exists' => $exists,
        ]);
    }

    public function generate(GenerateVoucherRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $alreadyExists = Voucher::where('flight_number', $validated['flightNumber'])
            ->where('flight_date', $validated['date'])
            ->exists();

        if ($alreadyExists) {
            return response()->json([
                'success' => false,
                'message' => 'Vouchers have already been generated for this flight and date.',
            ], 409); 
        }

        $seats = $this->seatGenerator->generate($validated['aircraft']);

        $voucher = Voucher::create([
            'crew_name' => $validated['name'],
            'crew_id' => $validated['id'],
            'flight_number' => $validated['flightNumber'],
            'flight_date' => $validated['date'],
            'aircraft_type' => $validated['aircraft'],
            'seat1' => $seats[0],
            'seat2' => $seats[1],
            'seat3' => $seats[2],
        ]);

        return (new VoucherResource($voucher))->response();
    }
}