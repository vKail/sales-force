import { Component } from '@angular/core';
import { ProductFormComponent } from "../../components/product-form/product-form.component";

@Component({
    selector: 'app-product-create-page',
    standalone: true,
    templateUrl: './product-create-page.component.html',
    styles: ``,
    imports: [ProductFormComponent]
})
export class ProductCreatePageComponent {}
