<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;




class UserController extends Controller
{

    public function index()
    {
        $search = request()->query('search');

        $users = User::with('roles')
            ->select('id', 'name', 'email', 'phone')
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhereHas('roles', function ($roleQuery) use ($search) {
                            $roleQuery->where('name', 'like', "%{$search}%");
                        });
                });
            })->orderBy('id', 'desc')
            ->paginate(50)
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'roles' => $user->getRoleNames(),
                ];
            });

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => request()->only(['search']),
        ]);
    }








    public function create()
    {
        return Inertia::render('Users/Create');
    }

    public function store(UserStoreRequest $request) // تم التغيير هنا
    {
        $validated = $request->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'], // يفترض أن التشفير يتم تلقائياً في الموديل
            'phone' => $validated['phone'] ?? null,
        ]);

        $user->assignRole($validated['roles']);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        $userWithRoles = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'roles' => $user->getRoleNames(),
        ];

        return Inertia::render('Users/Edit', ['user' => $userWithRoles]);
    }

    public function update(UserUpdateRequest $request, User $user) // تم التغيير هنا
    {
        $validated = $request->validated();

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
        ]);

        if (!empty($validated['password'])) {
            $user->update(['password' => $validated['password']]); // يفترض أن التشفير يتم تلقائياً
        }

        $user->syncRoles($validated['roles']);

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }
}
