import re

with open('src/components/LandingPage.tsx', 'r') as f:
    content = f.read()

# 1. Header Buttons
content = content.replace(
    'className="hidden md:inline-flex bg-orange-100 text-orange-600 hover:bg-orange-200 font-bold px-4 py-2 rounded-xl transition-colors"',
    'className="hidden md:inline-flex bg-orange-100 text-orange-600 hover:bg-orange-200 font-bold px-4 py-2 rounded-xl transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-lg"'
)

content = content.replace(
    'className="font-bold text-slate-700 hover:text-slate-900 transition-colors"',
    'className="font-bold text-slate-700 hover:text-slate-900 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"'
)

# 2. Hero Button
content = content.replace(
    'className="text-lg font-bold bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl transition-all shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1"',
    'className="text-lg font-bold bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1"'
)

# 3. Features Cards
content = content.replace(
    'className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"',
    'className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl"'
)

# 4. Pricing Buttons
content = content.replace(
    'className="w-full py-4 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"',
    'className="w-full py-4 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-lg border border-slate-200"'
)

content = content.replace(
    'className="w-full py-4 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 text-center block"',
    'className="w-full py-4 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 text-center block"'
)

# 5. Pricing Cards
content = content.replace(
    'className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col"',
    'className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl"'
)

content = content.replace(
    'className="bg-slate-900 rounded-3xl p-8 border-2 border-orange-500 shadow-xl shadow-orange-500/20 flex flex-col relative transform md:-translate-y-4"',
    'className="bg-slate-900 rounded-3xl p-8 border-2 border-orange-500 shadow-xl shadow-orange-500/20 flex flex-col relative transform md:-translate-y-4 transition-all duration-300 ease-in-out hover:-translate-y-6 hover:shadow-2xl"'
)

# 6. Testimonial Cards
content = content.replace(
    'className="bg-slate-800 rounded-3xl p-8 border border-slate-700"',
    'className="bg-slate-800 rounded-3xl p-8 border border-slate-700 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl"'
)

with open('src/components/LandingPage.tsx', 'w') as f:
    f.write(content)
