import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'radio-element-radio',
    templateUrl: './element-radio.component.html',
    styleUrl: './element-radio.component.css',
    standalone: false
})
export class ElementRadioComponent implements AfterViewInit,OnInit{
  @ViewChild('visualizerContainer')
  public visualizerContainer!:ElementRef<HTMLDivElement>
  // @ViewChild('visualizerContainer') visualizerContainer!: ElementRef;

  audioContext!: AudioContext;
  audioElement!: HTMLAudioElement;
  analyser!: AnalyserNode;
  source!: MediaElementAudioSourceNode;
  isPlaying: boolean = false;
  volume: number = 0.5;
  bars: number[] = Array(32).fill(0); // 32 barras para el visualizador
  barHeight: number[] = Array(32).fill(0);
  dataArray!: Uint8Array;
  barWidth: number = 0;
  containerHeight: number = 0;
  loadlingHTML:boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.audioElement = new Audio('https://streaming.radioestacion4.com/8104/stream'); // URL del stream de audio
    this.audioElement.crossOrigin = 'anonymous';
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.source = this.audioContext.createMediaElementSource(this.audioElement);
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
    this.analyser.fftSize = 256;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.updateVisualizer();
  }

  ngAfterViewInit(): void {
    this.updateContainerDimensions();
    this.cdr.detectChanges();
  }

  updateContainerDimensions(): void {
    // Obtén las dimensiones del contenedor
    const containerWidth = this.visualizerContainer.nativeElement.offsetWidth;
    this.containerHeight = this.visualizerContainer.nativeElement.offsetHeight;

    // Calcula el ancho de cada barra en función del ancho del contenedor
    this.barWidth = (containerWidth / this.bars.length) - 2; // Espacio entre barras
  }

  toggleAudio(): void {
    if (this.isPlaying) {
      this.audioElement.pause();
      this.isPlaying = false;
    } else {
      this.audioElement.play();
      this.audioContext.resume(); // En caso de que el contexto de audio esté en estado suspendido
      this.isPlaying = true;
    }
  }

  adjustVolume(value:number): void {
    this.volume = value;
    this.audioElement.volume = value;
  }

  updateVisualizer(): void {
    requestAnimationFrame(() => this.updateVisualizer());
    this.analyser.getByteFrequencyData(this.dataArray);

    // Asignamos valores a las alturas de las barras basados en el espectro de frecuencia
    for (let index = 0; index < this.dataArray.length; index++) {
      this.barHeight[index] = this.dataArray[index]/255;

    }
    // this.barHeight = Array.from(this.dataArray.slice(0, 32)).map((value) => value / 255); // Proporción de altura
  }
}
