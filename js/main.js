let eventBus = new Vue();

Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
            <p v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="error in errors">{{ error }}</li>
                </ul>
            </p>

            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name" placeholder="Your name">
            </p>

            <p>
                <label for="review">Review:</label>
                <textarea id="review" v-model="review"></textarea>
            </p>

            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>

            <p>
                <label for="recommend">Would you recommend this product?</label>
                <label>
                    <input type="radio" id="yes" name="recommend" value="yes" v-model="recommend"> Yes
                </label>
                <label>
                    <input type="radio" id="no" name="recommend" value="no" v-model="recommend"> No
                </label>
            </p>

            <button type="submit">Submit</button>
        </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        };
    },
    methods: {
        onSubmit() {
            this.errors = [];

            if (this.recommend === "yes" && this.rating < 4) {
                this.errors.push("If you recommend this product, the rating must be 4 or higher.");
            }

            if (this.name && this.review && this.rating >= 1 && !this.errors.length) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend === "yes" ? "Recommends" : "Does not recommend"
                };
                let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
                reviews.push(productReview);
                localStorage.setItem("reviews", JSON.stringify(reviews));

                this.$emit('review-submitted', productReview);

                this.name = null;
                this.review = null;
                this.rating = null;
                this.recommend = null;
            } else {
                if (!this.name) this.errors.push("Name required.");
                if (!this.review) this.errors.push("Review required.");
                if (!this.rating) this.errors.push("Rating required.");
                if (this.recommend === null) this.errors.push("Recommend selection is required.");
            }
        }
    }
});


Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        },
        shipping: {
            type: String,
            required: true
        },
        details: {
            type: Array,
            required: true
        }
    },
    template: `
        <div>
            <ul>
                <span class="tab"
                      :class="{ activeTab: selectedTab === tab }"
                      v-for="(tab, index) in tabs"
                      :key="index"
                      @click="selectedTab = tab">
                    {{ tab }}
                </span>
            </ul>

            <div v-show="selectedTab === 'Reviews'">
                <button @click="clearReviews" v-if="reviews.length">Clear Reviews</button>
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews" :key="review.name">
                        <p>{{ review.name }}</p>
                        <p>Rating: {{ review.rating }}</p>
                        <p>{{ review.review }}</p>
                        <p><strong>{{ review.recommend }}</strong></p>
                    </li>
                </ul>
            </div>

            <div v-show="selectedTab === 'Make a Review'">
                <product-review></product-review>
            </div>

            <div v-show="selectedTab === 'Shipping'">
                <p>Shipping Cost: {{ shipping }}</p>
            </div>

            <div v-show="selectedTab === 'Details'">
                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>
            </div>
        </div>
    `,
    data() {
        return {
            tabs: ["Reviews", "Make a Review", "Shipping", "Details"],
            selectedTab: "Reviews"
        };
    },
    methods: {
        clearReviews() {
            this.reviews = [];
            localStorage.setItem("reviews", JSON.stringify(this.reviews));
        }
    }
});


Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <div class="product">
            <div class="product-image">
                <img :src="image" :alt="altText">
            </div>

            <div class="product-info">
                <h1>{{ title }}</h1>
                <p v-if="inStock">In Stock</p>
                <p v-else>Out of Stock</p>
                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>
                <p>Shipping: {{ shipping }}</p>

                <div class="color-box"
                     v-for="(variant, index) in variants"
                     :key="variant.variantId"
                     :style="{ backgroundColor: variant.variantColor }"
                     @mouseover="updateProduct(index)">
                </div>

                <button @click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">
                    Add to cart
                </button>
            </div>

            <product-tabs :reviews="reviews" :shipping="shipping" :details="details"></product-tabs>
        </div>
    `,
    data() {
        return {
            product: "Socks",
            brand: "Vue Mastery",
            selectedVariant: 0,
            altText: "A pair of socks",
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "green",
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: "blue",
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],
            reviews: [] 
        };
    },
    methods: {
        addToCart() {
            this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
        }
    },
    computed: {
        title() {
            return this.brand + " " + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity > 0;
        },
        shipping() {
            return this.premium ? "Free" : "$2.99";
        }
    },
    mounted() {
        const savedReviews = localStorage.getItem("reviews");
        if (savedReviews) {
            this.reviews = JSON.parse(savedReviews);
        }
    }
});

let app = new Vue({
    el: "#app",
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        removeFromCart(id) {
            this.cart = this.cart.filter(item => item !== id);
        }
    }
});
