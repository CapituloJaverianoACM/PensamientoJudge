import { Directive , ElementRef , Input  } from '@angular/core';
declare var MathJax : any;


@Directive({
  selector: '[MathJax]'
})
export class MathjaxDirective {
  @Input('MathJax') fractionString: string;

  constructor(
    private el: ElementRef
  ) { }

  ngOnChanges()
  {
    this.el.nativeElement.innerHTML = this.fractionString;
    MathJax.Hub.Queue(["Typeset",MathJax.Hub, this.el.nativeElement]);
  }

}
