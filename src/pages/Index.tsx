import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowRight, Loader2 } from "lucide-react";
import { apiClient } from "@/contexts/AuthContext";
import { Product, Category, Banner, SpecialOffer } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [specialOffers, setSpecialOffers] = useState<SpecialOffer[]>([]);
  const [loading, setLoading] = useState({
    banners: true,
    categories: true,
    featured: true,
    newArrivals: true,
    offers: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading((prev) => ({ ...prev, banners: true }));
        const bannerRes = await apiClient.get<Banner[]>("/banners");
        setBanners(bannerRes.data.filter((b) => b.isActive));
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      } finally {
        setLoading((prev) => ({ ...prev, banners: false }));
      }

      try {
        setLoading((prev) => ({ ...prev, categories: true }));
        const categoryRes = await apiClient.get<Category[]>("/categories");
        setCategories(categoryRes.data); // Remove slice(0, 4) to include all categories
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading((prev) => ({ ...prev, categories: false }));
      }

      try {
        setLoading((prev) => ({ ...prev, featured: true }));
        const featuredRes = await apiClient.get<Product[]>("/products/featured");
        setFeaturedProducts(featuredRes.data);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoading((prev) => ({ ...prev, featured: false }));
      }

      try {
        setLoading((prev) => ({ ...prev, newArrivals: true }));
        const newArrivalsRes = await apiClient.get<Product[]>("/products?sort=createdAt&limit=8");
        setNewArrivals(newArrivalsRes.data);
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error);
      } finally {
        setLoading((prev) => ({ ...prev, newArrivals: false }));
      }

      try {
        setLoading((prev) => ({ ...prev, offers: true }));
        const offersRes = await apiClient.get<SpecialOffer[]>("/special-offers");
        setSpecialOffers(offersRes.data.filter((o) => o.isActive));
      } catch (error) {
        console.error("Failed to fetch special offers:", error);
      } finally {
        setLoading((prev) => ({ ...prev, offers: false }));
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  const renderSkeletons = (count: number, type: "product" | "category" | "offer") => {
    return Array.from({ length: count }).map((_, index) => {
      if (type === "product") {
        return (
          <CarouselItem key={`skel-prod-${index}`} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
            <div className="space-y-2">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CarouselItem>
        );
      } else if (type === "category") {
        return (
          <CarouselItem key={`skel-cat-${index}`} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
            <div className="space-y-2">
              <Skeleton className="h-40 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
          </CarouselItem>
        );
      } else {
        return (
          <div key={`skel-offer-${index}`} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center space-y-3">
            <Skeleton className="h-12 w-1/2 mx-auto" />
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-full mx-auto" />
            <Skeleton className="h-10 w-1/3 mx-auto" />
          </div>
        );
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner Carousel */}
      <section className="relative h-[60vh] overflow-hidden bg-gray-200">
        {loading.banners && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
          </div>
        )}
        {!loading.banners && banners.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            No banners available.
          </div>
        )}
        {!loading.banners &&
          banners.length > 0 &&
          banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentBannerIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${banner.imageUrl || "/placeholder.svg"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
                <div className="container mx-auto px-6">
                  <div className="max-w-lg">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                      {banner.title}
                    </h1>
                    {banner.subtitle && (
                      <p className="text-xl text-white/90 mb-8">{banner.subtitle}</p>
                    )}
                    <Link to={banner.linkUrl || "/products"}>
                      <Button size="lg">Shop Now</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

        {!loading.banners && banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentBannerIndex ? "bg-white" : "bg-white/50 hover:bg-white/75"
                }`}
                onClick={() => setCurrentBannerIndex(index)}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
            <Link to="/categories" className="text-primary hover:underline flex items-center">
              <span>View All</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <Carousel className="w-full">
            <CarouselContent className="-ml-4">
              {loading.categories
                ? renderSkeletons(4, "category")
                : categories.length > 0
                ? categories.map((category) => (
                    <CarouselItem
                      key={category.id}
                      className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                    >
                      <CategoryCard category={category} />
                    </CarouselItem>
                  ))
                : <CarouselItem className="text-center text-gray-500 w-full">
                    No categories found.
                  </CarouselItem>}
            </CarouselContent>
            {!loading.categories && categories.length > 4 && (
              <>
                <CarouselPrevious className="left-[-10px] md:left-2" />
                <CarouselNext className="right-[-10px] md:right-2" />
              </>
            )}
          </Carousel>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-primary hover:underline flex items-center">
              <span>View All</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <Carousel className="w-full">
            <CarouselContent className="-ml-4">
              {loading.featured
                ? renderSkeletons(4, "product")
                : featuredProducts.length > 0
                ? featuredProducts.map((product) => (
                    <CarouselItem
                      key={product.id}
                      className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                    >
                      <ProductCard product={product} featured={true} />
                    </CarouselItem>
                  ))
                : <CarouselItem className="text-center text-gray-500 w-full">
                    No featured products found.
                  </CarouselItem>}
            </CarouselContent>
            {!loading.featured && featuredProducts.length > 3 && (
              <>
                <CarouselPrevious className="left-[-10px] md:left-2" />
                <CarouselNext className="right-[-10px] md:right-2" />
              </>
            )}
          </Carousel>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Special Offers</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Check out our latest deals and limited-time offers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading.offers
              ? renderSkeletons(3, "offer")
              : specialOffers.length > 0
              ? specialOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
                  >
                    <div className="text-5xl font-bold mb-4">{offer.value}</div>
                    <h3 className="text-xl font-semibold mb-2">{offer.title}</h3>
                    <p className="mb-4">{offer.description}</p>
                    <Link to={offer.linkUrl || "/products"}>
                      <Button variant="secondary">{offer.buttonText || "Shop Now"}</Button>
                    </Link>
                  </div>
                ))
              : <p className="col-span-full text-center text-white/80">
                  No special offers available right now.
                </p>}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">New Arrivals</h2>
            <Link to="/products?sort=newest" className="text-primary hover:underline flex items-center">
              <span>View All</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {loading.newArrivals
              ? renderSkeletons(8, "product").map((skel) => (
                  <div key={skel.key} className="w-full">
                    {skel.props.children}
                  </div>
                ))
              : newArrivals.length > 0
              ? newArrivals.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              : <p className="col-span-full text-center text-gray-500">No new arrivals found.</p>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;