<?php

namespace App\Domain\Payments\Repositories;

use App\Models\Payment;
use Illuminate\Support\Facades\Cache;
use Illuminate\Cache\TaggableStore;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PaymentRepository
{
    public function query()
    {
        return Payment::query()->with('patient:id,name')->select('id', 'patient_id', 'amount', 'payment_date');
    }

    public function getAllPayments(array $filters = []): LengthAwarePaginator
    {
        $page = request('page', 1);
        $cacheKey = "payments.page.{$page}.search." . ($filters['search'] ?? '');


        $store = Cache::getStore();

        $build = function () use ($filters) {
            $query = $this->query();

            if (!empty($filters['search'])) {
                $query->join('patients', 'payments.patient_id', '=', 'patients.id')
                    ->where(function ($q) use ($filters) {
                        $q->where('patients.name', 'like', "%{$filters['search']}%")
                            ->orWhere('payments.amount', 'like', "%{$filters['search']}%");
                    })
                    ->select('payments.*');
            }



            return $query->orderByDesc('updated_at')->paginate(10)->withQueryString();
        };

        if ($store instanceof TaggableStore) {
            return Cache::tags('payments')->remember($cacheKey, now()->addMinutes(10), $build);
        }

        return Cache::remember($cacheKey, now()->addMinutes(10), $build);
    }

    public function createPayment(array $data): Payment
    {
        $payment = Payment::create($data);

        $store = Cache::getStore();
        if ($store instanceof TaggableStore) {
            Cache::tags('payments')->flush();
        } else {
            Cache::flush();
        }

        return $payment;
    }

    public function updatePayment(Payment $payment, array $data): bool
    {
        $updated = $payment->update($data);

        $store = Cache::getStore();
        if ($store instanceof TaggableStore) {
            Cache::tags('payments')->flush();
        } else {
            Cache::flush();
        }

        return $updated;
    }

    public function deletePayment(Payment $payment): bool
    {
        $deleted = $payment->delete();

        $store = Cache::getStore();
        if ($store instanceof TaggableStore) {
            Cache::tags('payments')->flush();
        } else {
            Cache::flush();
        }

        return $deleted;
    }
}
