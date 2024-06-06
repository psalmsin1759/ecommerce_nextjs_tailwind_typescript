import React, { useState, useEffect } from 'react';
import { WishlistProduct, getWishlist, deleteWishlist } from '@/model/wishlist';
import { useUser } from '@/context/UserContext';
import { Table } from 'flowbite-react';
import Image from 'next/image';
import { format } from 'date-fns';
import imageBasePath from '@/components/common/path';
import { AiFillDelete } from 'react-icons/ai';

function WishListPage() {
  const [wishlists, setWishlists] = useState<WishlistProduct[]>([]);
  const { state } = useUser();

  useEffect(() => {
    fetchWishList();
  }, []);

  const fetchWishList = async () => {
    try {
      const data = await getWishlist(state.user?.id ?? 0);

      setWishlists(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const deleteWishlistItem = async (id: number) => {
    console.log(id);
    const shouldDelete = window.confirm(
      'Are you sure you want to delete this item from your wishlist?'
    );

    if (shouldDelete) {
      try {
        await deleteWishlist(id);
        fetchWishList(); // Fetch the updated wishlist after deletion
      } catch (error) {
        console.error('Failed to delete wishlist item:', error);
      }
    }
  };

  return (
    <div className="p-2 flex flex-col gap-2">
      <span className="text-xl font-semibold">Wish List</span>
      <Table striped>
        <Table.Head>
          <Table.HeadCell></Table.HeadCell>
          <Table.HeadCell>ProductName</Table.HeadCell>
          <Table.HeadCell>Price</Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y border">
          {wishlists?.map((wishlistProduct: WishlistProduct, index) => (
            <Table.Row
              key={index}
              className="bg-white dark:border-gray-700 dark:bg-gray-800 p-2"
            >
              <Image
                src={imageBasePath + 'product/' + wishlistProduct.image_path}
                alt={wishlistProduct.name}
                width={90}
                height={116}
                className="border p-2"
              />

              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {wishlistProduct.name}
              </Table.Cell>
              <Table.Cell>{wishlistProduct.price}</Table.Cell>
              <Table.Cell>
                <AiFillDelete
                  size={24}
                  onClick={() => deleteWishlistItem(wishlistProduct.wishlistid)}
                  className="cursor-pointer"
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export default WishListPage;
