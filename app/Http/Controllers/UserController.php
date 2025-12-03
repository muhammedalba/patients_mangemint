<?php

namespace App\Http\Controllers;


use App\Domain\Users\Exceptions\CannotDeleteSelfException;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Models\User;

use Inertia\Inertia;
use Spatie\Permission\Models\Role;

use App\Domain\Users\DTOs\UserData;
use App\Domain\Users\Services\UserService;

class UserController extends Controller
{
    public function __construct(private UserService $userService) {}

    public function index()
    {
         $filters = request()->only('search');
        $users = $this->userService->listUsers($filters);

        return Inertia::render('Users/Index', [
            'users'   => $users,
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        return Inertia::render('Users/Create');
    }

    public function store(UserStoreRequest $request)
    {
        $dto = UserData::fromValidated($request->validated());
        $this->userService->createUser($dto);

        return redirect()->route('users.index')
            ->with('success', __('User created successfully.'));
    }

    public function edit(User $user)
    {
        $user->load('roles');

        return Inertia::render('Users/Edit', [
            'user' => [
                'id'     => $user->id,
                'name'   => $user->name,
                'email'  => $user->email,
                'phone'  => $user->phone,
                'roles'  => $user->roles->pluck('name'),
            ],
            'allRoles' => Role::pluck('name'),
        ]);
    }

    public function update(UserUpdateRequest $request, User $user)
    {
        $dto = UserData::fromValidated($request->validated());
        $this->userService->updateUser($dto, $user);

        return redirect()->route('users.index')
            ->with('success', __('User updated successfully.'));
    }

    public function destroy(User $user)
    {
        try {
            $this->userService->deleteUser($user);
        } catch (CannotDeleteSelfException $e) {
            return redirect()->route('users.index')->with('error', $e->getMessage());
        }

        return redirect()->route('users.index')->with('success', __('User deleted successfully.'));
    }
}
