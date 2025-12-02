'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AdminProduct } from '@/lib/admin/products';

interface ProductTableProps {
  products: AdminProduct[];
}

export default function ProductTable({ products }: ProductTableProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    const matchesSearch = 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
    inactive: 'bg-yellow-100 text-yellow-800',
    archived: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Filters */}
      <div className="border-b border-botanical-cream-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-botanical-green-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-botanical-green-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-md border border-botanical-green-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-botanical-green-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-botanical-cream-200">
          <thead className="bg-botanical-cream-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-botanical-green-700">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-botanical-green-700">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-botanical-green-700">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-botanical-green-700">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-botanical-green-700">
                Stats
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-botanical-green-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-botanical-cream-200">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-botanical-green-600">
                  No products found
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-botanical-cream-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 relative">
                        {product.thumbnailUrl ? (
                          <Image
                            src={product.thumbnailUrl}
                            alt={product.title}
                            fill
                            className="rounded-md object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-md bg-botanical-cream-200 flex items-center justify-center">
                            <span className="text-xs text-botanical-green-600">No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-botanical-green-900">
                          {product.title}
                        </div>
                        <div className="text-sm text-botanical-green-500">
                          {product.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-botanical-green-900">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-botanical-green-900">
                      ${product.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      statusColors[product.status] || statusColors.draft
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-botanical-green-600">
                    <div className="space-y-1">
                      <div>👁️ {product.view_count}</div>
                      <div>❤️ {product.favorite_count}</div>
                      <div>💰 {product.sales_count}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-botanical-green-600 hover:text-botanical-green-900 mr-4"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/shop/${product.slug}`}
                      target="_blank"
                      className="text-botanical-green-600 hover:text-botanical-green-900"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="border-t border-botanical-cream-200 px-6 py-4 bg-botanical-cream-50">
        <p className="text-sm text-botanical-green-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>
    </div>
  );
}

