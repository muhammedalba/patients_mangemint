<?php

namespace App\Domain\Users\Repositories;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Cache\TaggableStore;

class UserRepository
{
    public function create(array $data): User
    {
        Cache::flush();
        return User::create($data);
    }

    public function update(User $user, array $data): User
    {
        Cache::flush();
        $user->update($data);
        return $user;
    }

    public function delete(User $user): void
    {
        Cache::flush();
        $user->delete();
    }

    public function list(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $page = request('page', 1);
        $cacheKey = "users.page.{$page}.search." . ($filters['search'] ?? '');
        $store = Cache::getStore();
        $build = function () use ($filters) {
            $query = User::query()->with('roles:name,id')
                ->select(['id', 'name', 'email', 'phone']);
            if (!empty($filters['search'])) {
                $query->where(function ($q) use ($filters) {
                    $q->where('name', 'like', "%{$filters['search']}%")
                        ->orWhere('email', 'like', "%{$filters['search']}%");
                });
            }

            return $query->latest('updated_at')->paginate(10)->withQueryString();
        };
        if ($store instanceof TaggableStore) {
            return Cache::tags('users')->remember($cacheKey, now()->addMinutes(10), $build);
        }

        return Cache::remember($cacheKey, now()->addMinutes(10), $build);
    }
}
