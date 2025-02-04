Vue.component('product', {
    template: `
    <div class="product">
    <div class="product">
    
    <div class="product-image">
        <img alt="#" :src="image" :alt="altText"/>
    </div>

    <div class="product-info">
        <h1>{{ title }}</h1>
        <p>User is premium: {{ premium }}</p>
        <p v-if="inStock == false" :class="{ lineTrough: !inStock || inventory == 0 }">Out of stock</p>
        <p v-else-if="inventory > 10">In stock</p>
        <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p>
        <p v-else :class="{ lineTrough: !inStock || inventory == 0 }"> Out of stock </p>
        <span v-show="onSale">{{ sale }}</span>
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>

        <p>Shipping: {{ shipping }}</p>

        <div
        class="color-box"
        v-for="(variant, index) in variants"
        :key="variant.variantId"
        :style="{ backgroundColor:variant.variantColor }"
        @mouseover="updateProduct(index)"
        ></div>
 

        <div v-for="size in sizes">
            <p> {{ size }} </p>
        </div>
        <button
                v-on:click="addToCart"
                :disabled="!inStock"
                :class="{ disabledButton: !inStock }"
        >
            Add to cart
        </button>
        <button v-on:click="removeFromCart">Remove</button>
        <div class="cart">
                <p>Cart({{ cart }})</p>
        </div>
                      
    </div>


    <div class="more-products">
        <a :href="link">More products like this</a>
    </div>
         
</div>    </div>
    `,

    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            description: " A pair of warm, fuzzy socks",
            image: "./assets/vmSocks-green-onWhite.jpg",
            selectedVariant: 0,
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            inStock: true,
            inventory: 100,
            onSale: true,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
             ],         
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            cart: 0,
        }
    },

    methods: {
        addToCart() {
            this.cart += 1
        },

        removeFromCart() {
            if (this.cart > 0){
                this.cart -= 1
            }
        },

        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },

    },

    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },

        image() {
            return this.variants[this.selectedVariant].variantImage;
        },

        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },     
        
        sale(){
            return this.brand + ' ' + this.product + ' on sale!'
        },

        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        },

    },

    props: {
        premium: {
            type: Boolean,
            required: true
        },

            
    },
 
 })
 
let app = new Vue({
   el: '#app',
   data: {
       premium: true
   }
})