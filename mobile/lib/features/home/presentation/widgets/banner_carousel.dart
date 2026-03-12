import 'dart:async';
import 'package:flutter/material.dart';
import 'package:commerce/core/constants/app_constants.dart';
import 'package:commerce/core/widgets/cached_image.dart';
import 'package:commerce/features/home/data/models/banner_model.dart';

class BannerCarousel extends StatefulWidget {
  final List<BannerModel> banners;

  const BannerCarousel({super.key, required this.banners});

  @override
  State<BannerCarousel> createState() => _BannerCarouselState();
}

class _BannerCarouselState extends State<BannerCarousel> {
  late final PageController _controller;
  Timer? _timer;
  int _currentPage = 0;

  @override
  void initState() {
    super.initState();
    _controller = PageController();
    _startAutoScroll();
  }

  void _startAutoScroll() {
    if (widget.banners.length <= 1) return;
    _timer = Timer.periodic(AppConstants.autoScrollInterval, (_) {
      _currentPage = (_currentPage + 1) % widget.banners.length;
      _controller.animateToPage(
        _currentPage,
        duration: AppConstants.autoScrollDuration,
        curve: Curves.easeInOut,
      );
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Column(
      children: [
        SizedBox(
          height: 200,
          child: PageView.builder(
            controller: _controller,
            itemCount: widget.banners.length,
            onPageChanged: (index) => setState(() => _currentPage = index),
            itemBuilder: (context, index) {
              return AppCachedImage(
                imageUrl: widget.banners[index].imageUrl,
                fit: BoxFit.cover,
                width: double.infinity,
              );
            },
          ),
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(widget.banners.length, (index) {
            return Container(
              width: 6,
              height: 6,
              margin: const EdgeInsets.symmetric(horizontal: 3),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: index == _currentPage ? theme.colorScheme.primary : theme.colorScheme.outline,
              ),
            );
          }),
        ),
        const SizedBox(height: 12),
      ],
    );
  }
}
