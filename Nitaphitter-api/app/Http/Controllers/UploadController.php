public function store(Request $request)
{
    if ($request->hasFile('image')) {
        $path = $request->file('image')->store('public');
        return Storage::url($path);
    }
}