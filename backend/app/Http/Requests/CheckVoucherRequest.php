<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckVoucherRequest extends FormRequest
{

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'flightNumber' => ['required', 'string', 'max:10'],
            'date' => ['required', 'date_format:Y-m-d'],
        ];
    }

    public function messages(): array
    {
        return [
            'flightNumber.required' => 'Nomor penerbangan wajib diisi.',
            'flightNumber.max' => 'Nomor penerbangan maksimal 10 karakter.',
            'date.required' => 'Tanggal penerbangan wajib diisi.',
            'date.date_format' => 'Format tanggal harus YYYY-MM-DD.',
        ];
    }

    public function attributes(): array
    {
        return [
            'flightNumber' => 'nomor penerbangan',
            'date' => 'tanggal penerbangan',
        ];
    }
}