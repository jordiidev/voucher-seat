<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GenerateVoucherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'id' => ['required', 'string', 'max:50'],
            'flightNumber' => ['required', 'string', 'max:10'],
            'date' => ['required', 'date_format:Y-m-d'],
            'aircraft' => [
                'required',
                'string',
                Rule::in(['ATR', 'Airbus 320', 'Boeing 737 Max']),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama crew wajib diisi.',
            'id.required' => 'ID crew wajib diisi.',
            'flightNumber.required' => 'Nomor penerbangan wajib diisi.',
            'date.required' => 'Tanggal penerbangan wajib diisi.',
            'date.date_format' => 'Format tanggal harus YYYY-MM-DD.',
            'aircraft.required' => 'Tipe pesawat wajib dipilih.',
            'aircraft.in' => 'Tipe pesawat harus salah satu dari: ATR, Airbus 320, atau Boeing 737 Max.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'nama crew',
            'id' => 'ID crew',
            'flightNumber' => 'nomor penerbangan',
            'date' => 'tanggal penerbangan',
            'aircraft' => 'tipe pesawat',
        ];
    }
}