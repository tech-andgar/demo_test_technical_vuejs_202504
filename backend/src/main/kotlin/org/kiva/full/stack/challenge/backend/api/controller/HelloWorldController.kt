package org.kiva.full.stack.challenge.backend.api.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class HelloWorldController {
    @GetMapping("/hello-world")
    fun helloWorld(): String = "Hello World"
}
