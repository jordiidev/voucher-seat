<?php

namespace Tests\Feature;

use App\Models\Voucher;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VoucherTest extends TestCase
{
    use RefreshDatabase;

    public function test_check_returns_false_when_no_voucher_exists(): void
    {
        $response = $this->postJson('/api/check', [
            'flightNumber' => 'GA102',
            'date' => '2025-07-12',
        ]);

        $response->assertStatus(200)
            ->assertJson(['exists' => false]);
    }

    public function test_check_returns_true_when_voucher_exists(): void
    {
        Voucher::create([
            'crew_name' => 'Sarah',
            'crew_id' => '98123',
            'flight_number' => 'GA102',
            'flight_date' => '2025-07-12',
            'aircraft_type' => 'Airbus 320',
            'seat1' => '1A',
            'seat2' => '2B',
            'seat3' => '3C',
        ]);

        $response = $this->postJson('/api/check', [
            'flightNumber' => 'GA102',
            'date' => '2025-07-12',
        ]);

        $response->assertStatus(200)
            ->assertJson(['exists' => true]);
    }

    public function test_generate_creates_voucher_successfully(): void
    {
        $response = $this->postJson('/api/generate', [
            'name' => 'Sarah',
            'id' => '98123',
            'flightNumber' => 'GA102',
            'date' => '2025-07-12',
            'aircraft' => 'Airbus 320',
        ]);

        $response->assertStatus(201)
            ->assertJson(['success' => true])
            ->assertJsonStructure(['success', 'seats']);

        $this->assertDatabaseHas('vouchers', [
            'flight_number' => 'GA102',
            'flight_date' => '2025-07-12',
            'aircraft_type' => 'Airbus 320',
        ]);

        $seats = $response->json('seats');
        $this->assertCount(3, $seats);

        $this->assertEquals(3, count(array_unique($seats)));
    }

    public function test_generate_prevents_duplicate_for_same_flight_and_date(): void
    {
        Voucher::create([
            'crew_name' => 'Sarah',
            'crew_id' => '98123',
            'flight_number' => 'GA102',
            'flight_date' => '2025-07-12',
            'aircraft_type' => 'Airbus 320',
            'seat1' => '1A',
            'seat2' => '2B',
            'seat3' => '3C',
        ]);

        $response = $this->postJson('/api/generate', [
            'name' => 'John',
            'id' => '99999',
            'flightNumber' => 'GA102',
            'date' => '2025-07-12',
            'aircraft' => 'Airbus 320',
        ]);

        $response->assertStatus(409)
            ->assertJson(['success' => false]);
    }

    public function test_generate_fails_validation_when_required_field_missing(): void
    {
        $response = $this->postJson('/api/generate', [
            'name' => '',
            'id' => '98123',
            'flightNumber' => 'GA102',
            'date' => '2025-07-12',
            'aircraft' => 'Airbus 320',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name']);
    }

    public function test_generate_fails_validation_when_aircraft_invalid(): void
    {
        $response = $this->postJson('/api/generate', [
            'name' => 'Sarah',
            'id' => '98123',
            'flightNumber' => 'GA102',
            'date' => '2025-07-12',
            'aircraft' => 'Boeing 747',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['aircraft']);
    }

    public function test_generated_seats_are_valid_for_atr_aircraft(): void
    {
        $response = $this->postJson('/api/generate', [
            'name' => 'Sarah',
            'id' => '98123',
            'flightNumber' => 'ATR001',
            'date' => '2025-07-12',
            'aircraft' => 'ATR',
        ]);

        $response->assertStatus(201);

        $seats = $response->json('seats');

        foreach ($seats as $seat) {
            $column = substr($seat, -1);
            $row = (int) substr($seat, 0, -1);

            $this->assertContains($column, ['A', 'C', 'D', 'F']);
            $this->assertGreaterThanOrEqual(1, $row);
            $this->assertLessThanOrEqual(18, $row);
        }
    }
}