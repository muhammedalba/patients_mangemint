<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;

use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{

    public function index()
    {
        try {
            $search = request()->query('search');

            $users = User::query()
                ->with('roles:id,name')
                ->select('id', 'name', 'email', 'phone')
                ->when($search, function ($query, $search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%")
                            ->orWhereHas('roles', function ($roleQuery) use ($search) {
                                $roleQuery->where('name', 'like', "%{$search}%");
                            });
                    });
                })
                ->orderByDesc('id')
                ->paginate(10)
                ->withQueryString()
                ->through(function ($user) {
                    return [
                        'id'    => $user->id,
                        'name'  => $user->name,
                        'email' => $user->email,
                        'phone' => $user->phone,
                        'roles' => $user->roles->pluck('name'),
                    ];
                });

            return Inertia::render('Users/Index', [
                'users'   => $users,
                'filters' => [
                    'search' => $search,
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error('Failed to load users list', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->with('error', __('Something went wrong while loading users.'));
        }
    }








    public function create()
    {
        return Inertia::render('Users/Create');
    }

    public function store(UserStoreRequest $request)
    {
        $validated = $request->validated();
        try {
            $user = User::create([
                'name'     => $validated['name'],
                'email'    => $validated['email'],
                'password' => $validated['password'],
                'phone'    => $validated['phone'] ?? null,
            ]);

            if (!empty($validated['roles'])) {
                $user->assignRole($validated['roles']);
            }

            return redirect()
                ->route('users.index')
                ->with('success', __('User created successfully.'));
        } catch (\Throwable $e) {
            Log::error('User creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data'  => $validated,
            ]);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', __('Something went wrong while creating the user. Please try again later.'));
        }
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
        $validated = $request->validated();

        try {
            $updateData = [
                'name'  => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'] ?? null,
            ];

            if (!empty($validated['password'])) {
                $updateData['password'] = $validated['password'];
            }

            $user->update($updateData);

            if (!empty($validated['roles'])) {
                $user->syncRoles($validated['roles']);
            }

            return redirect()
                ->route('users.index')
                ->with('success', __('User updated successfully.'));
        } catch (\Throwable $e) {
            Log::error('User update failed', [
                'user_id' => $user->id ?? null,
                'error'   => $e->getMessage(),
                'trace'   => $e->getTraceAsString(),
                'data'    => $validated,
            ]);

            return redirect()
                ->back()
                ->withInput()
                ->with('error', __('Something went wrong while updating the user. Please try again later.'));
        }
    }


    public function destroy(User $user)
    {
        try {
            if (Auth::id() === $user->id) {
                return redirect()->back()->with('error', __('لا يمكنك حذف حسابك الخاص.'));
            }

            $user->delete();

            return redirect()
                ->route('users.index')
                ->with('success', 'تم حذف المستخدم بنجاح.');
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', 'حدث خطأ أثناء حذف المستخدم. ' . $e->getMessage());
        }
    }
}
