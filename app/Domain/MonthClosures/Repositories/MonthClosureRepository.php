<?php

namespace App\Domain\MonthClosures\Repositories;

use App\Models\MonthClosure;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Cache\TaggableStore;

class MonthClosureRepository
{
      public function query()
      {
            return MonthClosure::query()->select('id', 'year', 'month', 'closed_by', 'closed_at');
      }

      public function list(?int $year = null, int $perPage = 15): LengthAwarePaginator
      {
            $page = request('page', 1);
            $cacheKey = "month_closures.page.{$page}.year." . ($year ?? 'all');

            $store = Cache::getStore();

            $build = function () use ($year, $perPage) {
                  $q = $this->query()->with('closedBy:id,name');

                  if ($year) {
                        $q->where('year', $year);
                  }

                  return $q->orderByDesc('year')->orderByDesc('month')->paginate($perPage)->withQueryString();
            };

            if ($store instanceof TaggableStore) {
                  return Cache::tags('month_closures')->remember($cacheKey, now()->addMinutes(10), $build);
            }

            return Cache::remember($cacheKey, now()->addMinutes(10), $build);
      }

      public function create(array $data): MonthClosure
      {
            $closure = MonthClosure::create($data);

            $store = Cache::getStore();
            if ($store instanceof TaggableStore) {
                  Cache::tags('month_closures')->flush();
            } else {
                  Cache::flush();
            }

            return $closure;
      }

}
