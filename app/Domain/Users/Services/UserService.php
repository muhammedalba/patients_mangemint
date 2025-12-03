<?php

namespace App\Domain\Users\Services;

use App\Domain\Users\DTOs\UserData;
use App\Domain\Users\Exceptions\CannotDeleteSelfException;
use App\Domain\Users\Repositories\UserRepository;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class UserService
{
    public function __construct(private UserRepository $repo) {}

    public function listUsers(array $filters = [])
    {
        return $this->repo->list($filters);
    }

    public function createUser(UserData $data): User
    {
        try {
            $user = $this->repo->create($data->toArray());

            if (!empty($data->roles)) {
                $user->assignRole($data->roles);
            }

            return $user;
        } catch (\Throwable $e) {
            Log::error('User creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data'  => $data,
            ]);
            throw $e;
        }
    }

    public function updateUser(UserData $data, User $user): User
    {
        try {
            $updated = $this->repo->update($user, $data->toArray());

            if (!empty($data->roles)) {
                $updated->syncRoles($data->roles);
            }

            return $updated;
        } catch (\Throwable $e) {
            Log::error('User update failed', [
                'user_id' => $user->id,
                'error'   => $e->getMessage(),
                'trace'   => $e->getTraceAsString(),
                'data'    => $data,
            ]);
            throw $e;
        }
    }

    /**
     * @throws CannotDeleteSelfException
     */
    public function deleteUser(User $user): void
    {
        if (Auth::id() === $user->id) {
            throw new CannotDeleteSelfException(__('You cannot delete your own account.'));
        }

        $this->repo->delete($user);
    }
}
