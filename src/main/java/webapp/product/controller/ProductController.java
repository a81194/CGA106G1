package webapp.product.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import webapp.product.dto.ProductDTO;
import webapp.product.pojo.Product;
import webapp.product.service.ProductService;

import java.util.List;


@Controller
@RequestMapping("/product")
public class ProductController {

    final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }


    @PostMapping("/save-product")
    @ResponseBody
    public Boolean saveEmployee(@RequestBody ProductDTO productDTO) {
        return productService.saveProduct(productDTO);
    }


    @GetMapping("/ls-one")
    @ResponseBody
    public ProductDTO findById(@RequestParam Integer id) {
        return productService.findById(id);
    }
    @GetMapping("/set-status")
    @ResponseBody
    public Boolean updateStatus(@RequestParam Integer id, @RequestParam Boolean status) {
        return productService.updateStatus(id, status);
    }

    @PostMapping("/save-product")
    @ResponseBody
    public Boolean saveProduct(@RequestBody ProductDTO productDTO) {
        return productService.saveProduct(productDTO);
    }

    @GetMapping("/find-one")
    @ResponseBody
    public ProductDTO findProdById(@RequestParam Integer id){
        return productService.findById(id);
    }

    @GetMapping("/get-all")
    @ResponseBody
    public List<Product> getallProduct() {
        return productService.getAllProduct();
    }
}
