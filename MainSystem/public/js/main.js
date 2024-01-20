(function ($) {
    "use strict";

    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $(".navbar .dropdown")
                    .on("mouseover", function () {
                        $(".dropdown-toggle", this).trigger("click");
                    })
                    .on("mouseout", function () {
                        $(".dropdown-toggle", this).trigger("click").blur();
                    });
            } else {
                $(".navbar .dropdown").off("mouseover").off("mouseout");
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });

    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $(".back-to-top").fadeIn("slow");
        } else {
            $(".back-to-top").fadeOut("slow");
        }
    });
    $(".back-to-top").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 500, "easeInOutExpo");
        return false;
    });

    if ($(".related-carousel").length) {
        $(".related-carousel").owlCarousel({
            loop: true,
            margin: 29,
            nav: false,
            autoplay: true,
            smartSpeed: 1000,
            responsive: {
                0: {
                    items: 1,
                },
                576: {
                    items: 2,
                },
                768: {
                    items: 3,
                },
                992: {
                    items: 4,
                },
            },
        });
    }

    // Product Quantity
    $(".btn-minus").on("click", () => {
        const quantity = $("#product-quantity");
        if (+quantity.val() > +quantity.attr("min")) {
            quantity.val(+quantity.val() - 1);
        }
    });
    $(".btn-plus").on("click", () => {
        const quantity = $("#product-quantity");
        if (+quantity.val() < +quantity.attr("max")) {
            quantity.val(+quantity.val() + 1);
        }
    });

    $("#product-quantity").on("change", function (e) {
        const quantity = $(this);
        if (+quantity.val() > +quantity.attr("max")) {
            quantity.val(quantity.attr("max"));
        } else if (+quantity.val() < +quantity.attr("min")) {
            quantity.val(quantity.attr("min"));
        }
    });

    // Search Input
    $(".form-search").on("submit", (e) => {
        if (!$(".search-input").val().trim()) {
            e.preventDefault();
        }
    });
    $(".form-lg-search").on("submit", (e) => {
        if (!$(".search-lg-input").val().trim()) {
            e.preventDefault();
        }
    });
    $(".register-form").on("submit", async (e) => {
        e.preventDefault();
        const username = $("#username").val();
        const password = $("#password").val();
        const confirmPassword = $("#confirm-password").val();
        let block = 0;

        if (password !== confirmPassword) {
            $(".error-register").html("Mật khẩu xác nhận không chính xác");
            block = 1;
        }
        if (block === 0) {
            $(".bar").removeClass("hidden");
            const res = await fetch("/customer/api/register", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
            const { status, message } = await res.json();
            $(".bar").addClass("hidden");
            if (status === "success") {
                const toastLiveExample = $("#liveToast");
                const toastBootstrap =
                    bootstrap.Toast.getOrCreateInstance(toastLiveExample);
                toastBootstrap.show();
                setTimeout(() => {
                    window.location.href = "/login";
                }, 1000);
            } else {
                $(".error-register").html(message);
            }
        }
    });
})(jQuery);
