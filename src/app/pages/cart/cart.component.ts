import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { loadStripe } from "@stripe/stripe-js";
import { Cart, CartItem } from "src/app/models/cart.model";
import { CartService } from "src/app/services/cart.service";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
})
export class CartComponent implements OnInit {
  cart: Cart = {
    items: [
      {
        product: "http://via.placeholder.com/150",
        name: "T-shirt",
        price: 150,
        quantity: 2,
        id: 1,
      },
      {
        product: "http://via.placeholder.com/150",
        name: "T-shirt",
        price: 200,
        quantity: 3,
        id: 1,
      },
    ],
  };

  dataSource: Array<CartItem> = [];
  displayedColumns: Array<string> = [
    "product",
    "name",
    "price",
    "quantity",
    "total",
    "action",
  ];

  constructor(private cartService: CartService, private http: HttpClient) {}

  ngOnInit(): void {
    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    });

    // this.cart.items = JSON.parse(localStorage.getItem("cart") || "");
    // this.dataSource = this.cart.items;
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
    // return parseInt(localStorage.getItem("total") || "");
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }

  onCheckout(): void {
    this.http
      .post("http://localhost:4242/checkout", {
        items: this.cart.items,
      })
      .subscribe(async (res: any) => {
        let stripe = await loadStripe(
          "pk_test_51Nh6d1SGaFRKR8toU2QDDSInwf9UC7L02lUPjP2jvwjgtbqMtAfbYUZMnKTObQ6z9aOn3Y0Fk2ebGBZYfQvyZeQE00p1OdSM5f"
        );
        stripe?.redirectToCheckout({
          sessionId: res.id,
        });
      });
  }
}
