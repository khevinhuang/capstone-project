import { Button } from "@/components/ui/Button";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useProductDetail } from "../hooks/useProductDetail";
import { toDisplayPrice } from "../utils/price";

function formatPrice(price: string | number | undefined) {
  if (Number.isNaN(Number(price))) return '-';
  const value = toDisplayPrice(price);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string | Date | undefined) {
  if (!value) return '-';
  const date = typeof value === 'string' ? new Date(value) : value;
  return Number.isNaN(date.getTime()) ? '-' : format(date, "dd MMM yyyy");
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const normalizeId = id?.trim();
  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useProductDetail(normalizeId, true);
  const resolvedProduct = product;
  const errorStatus = (error as { response?: { status?: number } } | null)?.response?.status;

  if (!normalizeId) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-ait-body-lg-regular text-ait-neutral-600 mb-4">Invalid or missing product ID</p>
        <Button onClick={() => { void navigate('/product'); }}>Back to Products</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 rounded-full border-4 border-ait-neutral-200 border-t-ait-primary-500 animate-spin mb-4" />
        <p className="text-ait-body-lg-regular text-ait-neutral-600">Loading product...</p>
      </div>
    );
  }

  if (isError) {
    if (errorStatus === 404) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-ait-body-lg-regular text-ait-neutral-600 mb-4">Product not found</p>
          <Button
            onClick={() => {
              void navigate('/product');
            }}
          >
            Back to Products
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-ait-body-lg-regular text-ait-neutral-600 mb-4">
          Failed to load product. Please try again.
        </p>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              void refetch();
            }}
            disabled={isFetching}
          >
            {isFetching ? 'Retrying...' : 'Retry'}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              void navigate('/product');
            }}
          >
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  if (!resolvedProduct) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-ait-body-lg-regular text-ait-neutral-600 mb-4">Product not found</p>
        <Button
          onClick={() => {
            void navigate('/product');
          }}
        >
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="text"
          size="sm"
          onClick={() => {
            void navigate('/product');
          }}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-4 flex-1">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-ait-neutral-100 border border-ait-neutral-200 flex items-center justify-center">
            {resolvedProduct.avatar ? (
              <img
                src={resolvedProduct.avatar}
                alt={resolvedProduct.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-ait-body-md-semibold text-ait-neutral-600">
                {resolvedProduct.name?.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <h1 className="text-ait-h1 text-ait-neutral-900">{resolvedProduct.name}</h1>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-ait-neutral-200 shadow-sm">
        <div className="px-6 py-4 border-b border-ait-neutral-200">
          <h2 className="text-ait-body-lg-semibold text-ait-neutral-900">Details</h2>
        </div>

        <div className="p-6">
          <div className="border border-ait-neutral-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-ait-neutral-200">
              <tbody className="bg-white divide-y divide-ait-neutral-200">
                <tr>
                  <td className="px-4 py-3 text-ait-body-md-medium text-ait-neutral-700 w-48">
                    Product ID
                  </td>
                  <td className="px-4 py-3 text-ait-body-md-regular text-ait-neutral-600">
                    {resolvedProduct.id}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-ait-body-md-medium text-ait-neutral-700">
                    Name
                  </td>
                  <td className="px-4 py-3 text-ait-body-md-regular text-ait-neutral-600">
                    {resolvedProduct.name}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-ait-body-md-medium text-ait-neutral-700">
                    Price
                  </td>
                  <td className="px-4 py-3 text-ait-body-md-regular text-ait-neutral-600">
                    {formatPrice(resolvedProduct.price)}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-ait-body-md-medium text-ait-neutral-700">
                    Stock
                  </td>
                  <td className="px-4 py-3 text-ait-body-md-regular text-ait-neutral-600">
                    {resolvedProduct.stock ?? 0}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-ait-body-md-medium text-ait-neutral-700">
                    Category
                  </td>
                  <td className="px-4 py-3 text-ait-body-md-regular text-ait-neutral-600">
                    {resolvedProduct.category || '-'}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-ait-body-md-medium text-ait-neutral-700">
                    Description
                  </td>
                  <td className="px-4 py-3 text-ait-body-md-regular text-ait-neutral-600">
                    {resolvedProduct.description || '-'}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-ait-body-md-medium text-ait-neutral-700">
                    Avatar
                  </td>
                  <td className="px-4 py-3 text-ait-body-md-regular text-ait-neutral-600">
                    {resolvedProduct.avatar ? (
                      <img
                        src={resolvedProduct.avatar}
                        alt={resolvedProduct.name}
                        className="w-10 h-10 rounded-full object-cover border border-ait-neutral-200"
                      />
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-ait-body-md-medium text-ait-neutral-700">
                    Created At
                  </td>
                  <td className="px-4 py-3 text-ait-body-md-regular text-ait-neutral-600">
                    {formatDate(resolvedProduct.createAt)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
