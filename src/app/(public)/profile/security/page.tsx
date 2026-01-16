'use client';

import { useState } from 'react';
import { generateRecoveryCodes } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldCheck, Copy, Check, Download, RefreshCw, KeyRound, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/components/providers/language-provider';

export default function SecurityPage() {
    const { t } = useTranslation();
    const [codes, setCodes] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        const confirm = window.confirm(t('security.recovery_codes.confirm_generate'));
        if (!confirm) return;

        setLoading(true);
        try {
            const result = await generateRecoveryCodes();
            if (result.error) {
                toast.error(result.error);
            } else if (result.codes) {
                setCodes(result.codes);
                toast.success(t('security.recovery_codes.generate_success', { defaultValue: 'New recovery codes generated.' }));
            }
        } catch (error) {
            toast.error('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        const text = codes.join('\n');
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success(t('security.recovery_codes.copy_success', { defaultValue: 'Codes copied to clipboard' }));
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const text = codes.join('\n');
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vnnovely-recovery-codes.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="container mx-auto max-w-3xl py-10 space-y-8">
            <div className="space-y-2 text-center sm:text-left">
                <h2 className="text-3xl font-bold tracking-tight">{t('security.title')}</h2>
                <p className="text-muted-foreground">
                    {t('security.subtitle')}
                </p>
            </div>

            <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/10 border-b border-border/40 pb-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-xl shadow-sm">
                            <KeyRound className="h-6 w-6 text-orange-600 dark:text-orange-500" />
                        </div>
                        <div className="text-center sm:text-left space-y-1">
                            <CardTitle className="text-xl">{t('security.recovery_codes.title')}</CardTitle>
                            <CardDescription className="text-base leading-relaxed max-w-lg">
                                {t('security.recovery_codes.description')}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pt-8 mb-4">
                    {!codes.length ? (
                        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4 rounded-lg border-2 border-dashed border-muted-foreground/10 bg-muted/5">
                            <div className="p-4 bg-background rounded-full shadow-sm">
                                <ShieldCheck className="h-10 w-10 text-muted-foreground/40" />
                            </div>
                            <div className="space-y-1 max-w-sm">
                                <h3 className="font-medium text-foreground">{t('security.recovery_codes.no_codes_title')}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {t('security.recovery_codes.no_codes_desc')}
                                </p>
                            </div>
                            <Button onClick={handleGenerate} disabled={loading} size="lg" className="bg-orange-600 hover:bg-orange-700 text-white mt-2 shadow-md shadow-orange-500/20">
                                {loading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                                {loading ? t('security.recovery_codes.generating') : t('security.recovery_codes.generate_btn')}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                            <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900/30 dark:bg-amber-950/10">
                                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5" />
                                <div className="ml-2">
                                    <AlertTitle className="text-amber-900 dark:text-amber-400 font-semibold mb-1">
                                        {t('security.recovery_codes.important_title')}
                                    </AlertTitle>
                                    <AlertDescription className="text-amber-800 dark:text-amber-300/90 text-[13px] leading-relaxed">
                                        {t('security.recovery_codes.important_desc')}
                                    </AlertDescription>
                                </div>
                            </Alert>

                            <div className="bg-card border rounded-xl overflow-hidden shadow-inner">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border/40 p-px">
                                    {codes.map((code, i) => (
                                        <div key={i} className="py-4 px-4 bg-background flex items-center justify-center font-mono text-base tracking-wider hover:bg-muted/20 transition-colors select-all">
                                            {code}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Button onClick={handleCopy} variant="secondary" className="flex-1 gap-2 h-11 border border-border/50 shadow-sm transition-all hover:bg-secondary/80">
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    {copied ? t('security.recovery_codes.copied') : t('security.recovery_codes.copy')}
                                </Button>
                                <Button onClick={handleDownload} variant="secondary" className="flex-1 gap-2 h-11 border border-border/50 shadow-sm transition-all hover:bg-secondary/80">
                                    <Download className="h-4 w-4" />
                                    {t('security.recovery_codes.download')}
                                </Button>
                            </div>

                            <div className="flex justify-center pt-6 border-t border-dashed border-border/60">
                                <Button
                                    onClick={handleGenerate}
                                    disabled={loading}
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                >
                                    <RefreshCw className={`mr-2 h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                                    {t('security.recovery_codes.generate_btn')} {t('common.regenerate_suffix')}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
