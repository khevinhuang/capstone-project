import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-neutral-900">Khatulistiwa AirCore</h1>

        <p className="mt-2 text-neutral-600">
          A feature-first scaffold with modern tooling and sensible defaults.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-neutral-200 p-5">
            <div className="text-sm font-semibold text-neutral-900">Examples</div>
            <p className="mt-1 text-sm text-neutral-600">
              Explore existing screens to see patterns in action.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="primary" onClick={() => (window.location.href = '/users')}>
                Users
              </Button>
              <Button variant="secondary" onClick={() => (window.location.href = '/team')}>
                Team
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 p-5">
            <div className="text-sm font-semibold text-neutral-900">Where to edit</div>
            <ul className="mt-3 space-y-2 text-sm text-neutral-700">
              <li>
                Features live in <code className="rounded bg-neutral-100 px-1">src/features/*</code>
              </li>
              <li>
                Routes live in{' '}
                <code className="rounded bg-neutral-100 px-1">src/routes/index.tsx</code>
              </li>
              <li>
                UI components live in{' '}
                <code className="rounded bg-neutral-100 px-1">src/components/ui</code>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-info-50 border border-info-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-info-900 mb-2">Next steps</h2>
        <ul className="space-y-2 text-info-800 text-sm">
          <li>
            Configure your API endpoint in <code className="bg-info-100 px-1 rounded">.env</code>
          </li>
          <li>
            Create new features in <code className="bg-info-100 px-1 rounded">src/features/</code>
          </li>
          <li>
            Run checks with <code className="bg-info-100 px-1 rounded">pnpm lint</code> and{' '}
            <code className="bg-info-100 px-1 rounded">pnpm type-check</code>
          </li>
        </ul>
      </div>
    </div>
  );
}
