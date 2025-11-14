<?php

namespace App\Domain\Users\Repositories;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

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

    public function list(?string $search = null, int $perPage = 10): LengthAwarePaginator
    {
        $page = request('page', 1);
        $cacheKey = "users.page.{$page}.search.{$search}";

        return Cache::remember($cacheKey, now()->addMinutes(10), function () use ($search, $perPage) {
            return User::query()
                ->select(['id', 'name', 'email', 'phone'])
                ->when(
                    $search,
                    fn($q) => $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                )
                ->orderByDesc('updated_at')
                ->paginate($perPage)
                ->withQueryString();
        });
    }
}
