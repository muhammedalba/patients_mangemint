<?php
namespace App\Domain\Users\Repositories;

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Cache\TaggableStore;

class UserRepository
{
    private function getCacheStore()
    {
        return Cache::getStore();
    }

    public function create(array $data): User
    {
        $user = User::create($data);
        $this->clearCache();
        return $user;
    }

    public function update(User $user, array $data): User
    {
        $user->update($data);
        $this->clearCache();
        return $user;
    }

    public function delete(User $user): void
    {
        $user->delete();
        $this->clearCache();
    }

    public function list(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $page = request('page', 1);
        $cacheKey = "users.page.{$page}.search." . ($filters['search'] ?? '');
        $store = $this->getCacheStore();

        $build = function () use ($filters, $perPage) {
            $query = User::query()->with('roles:name,id')
                ->select(['id', 'name', 'email', 'phone']);

            if (!empty($filters['search'])) {
                $query->where(function ($q) use ($filters) {
                    $q->where('name', 'like', "%{$filters['search']}%")
                      ->orWhere('email', 'like', "%{$filters['search']}%");
                });
            }

            return $query->latest('updated_at')->paginate($perPage)->withQueryString();
        };

        if ($store instanceof TaggableStore) {
            return Cache::tags('users')->remember($cacheKey, now()->addMinutes(10), $build);
        }
        return Cache::remember($cacheKey, now()->addMinutes(10), $build);
    }

    private function clearCache(): void
    {
        $store = $this->getCacheStore();
        if ($store instanceof TaggableStore) {
            Cache::tags('users')->flush();
        } else {
            Cache::flush();
        }
    }
}
