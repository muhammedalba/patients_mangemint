<?php

namespace App\Domain\Payments\Repositories;

use App\Models\Payment;
use Illuminate\Support\Facades\Cache;
use Illuminate\Cache\TaggableStore;

class PaymentRepository
{
      public function getAllPayments(): \Illuminate\Support\Collection
      {
            $cacheKey = 'payments.all';
            $store = Cache::getStore();

            $build = function () {
                  return Payment::with('patient')->get();
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
